const {
    onDocumentCreated
} = require("firebase-functions/v2/firestore");

const {
    onDocumentUpdated
} = require("firebase-functions/v2/firestore");

const {
    initializeApp
} = require("firebase-admin/app");

const {
    getAuth
} = require("firebase-admin/auth");

const {
    getFirestore,
    FieldValue
} = require("firebase-admin/firestore");


/* ==========================================
   INITIALIZE FIREBASE ADMIN
========================================== */

initializeApp();


const db = getFirestore();

const auth = getAuth();


/* ==========================================
   CREATE AUTH ACCOUNT WHEN MEMBER IS CREATED
========================================== */

exports.createMemberAuthAccount =
    onDocumentCreated(
        "members/{memberId}",
        async event => {

            const snapshot =
                event.data;

            if (!snapshot) {
                return;
            }


            const member =
                snapshot.data();

            const memberId =
                event.params.memberId;


            /*
             * If the member already has
             * a Firebase Auth UID, don't
             * create another account.
             */

            if (member.uid) {

                console.log(
                    `Member ${memberId} already has UID.`
                );

                return;

            }


            const email =
                String(
                    member.email || ""
                )
                    .trim()
                    .toLowerCase();


            /*
             * Email is required for the
             * Firebase Authentication account.
             */

            if (!email) {

                console.log(
                    `Member ${memberId} has no email.`
                );

                await snapshot.ref.update({

                    authStatus:
                        "email_required",

                    authError:
                        "Member email is required before creating the Firebase Authentication account.",

                    updatedAt:
                        FieldValue.serverTimestamp()

                });

                return;

            }


            try {

                /*
                 * Check whether this email
                 * already exists in Firebase Auth.
                 */

                let userRecord;

                try {

                    userRecord =
                        await auth.getUserByEmail(
                            email
                        );

                } catch (error) {

                    /*
                     * auth/user-not-found means
                     * we can create a new account.
                     */

                    if (
                        error.code ===
                        "auth/user-not-found"
                    ) {

                        userRecord =
                            await auth.createUser({

                                email: email,

                                emailVerified:
                                    false,

                                disabled:
                                    false,

                                displayName:
                                    member.displayName ||
                                    member.tiktokUsername ||
                                    "NIGHTFALL DEVILS Member"

                            });

                    } else {

                        throw error;

                    }

                }


                /*
                 * Set custom claims.
                 *
                 * These claims can later be used
                 * for secure role-based access.
                 */

                const role =
                    String(
                        member.role ||
                        "Member"
                    )
                        .trim();


                const normalizedRole =
                    role.toLowerCase();


                const isAdmin =
                    normalizedRole === "admin" ||
                    normalizedRole === "super admin" ||
                    normalizedRole === "founder";


                await auth.setCustomUserClaims(
                    userRecord.uid,
                    {

                        role: role,

                        admin:
                            isAdmin,

                        memberId:
                            memberId

                    }
                );


                /*
                 * Update the member document
                 * with the Firebase Auth UID.
                 */

                await snapshot.ref.update({

                    uid:
                        userRecord.uid,

                    authStatus:
                        "created",

                    authCreatedAt:
                        FieldValue.serverTimestamp(),

                    authEmail:
                        email,

                    updatedAt:
                        FieldValue.serverTimestamp()

                });


                console.log(
                    `Firebase Auth account created/linked for ${email}`
                );


            } catch (error) {

                console.error(
                    `Failed to create Auth account for ${memberId}:`,
                    error
                );


                await snapshot.ref.update({

                    authStatus:
                        "error",

                    authError:
                        error.message ||
                        "Unknown Firebase Authentication error.",

                    updatedAt:
                        FieldValue.serverTimestamp()

                });

            }

        }
    );


/* ==========================================
   HANDLE MEMBER ROLE / STATUS CHANGES
========================================== */

exports.updateMemberAuthAccount =
    onDocumentUpdated(
        "members/{memberId}",
        async event => {

            const before =
                event.data.before.data();

            const after =
                event.data.after.data();

            const memberId =
                event.params.memberId;


            /*
             * If there is no Auth UID,
             * there is nothing to update.
             */

            if (!after.uid) {
                return;
            }


            const roleChanged =
                before.role !==
                after.role;


            const statusChanged =
                before.status !==
                after.status;


            const emailChanged =
                before.email !==
                after.email;


            const nameChanged =
                before.displayName !==
                after.displayName;


            if (
                !roleChanged &&
                !statusChanged &&
                !emailChanged &&
                !nameChanged
            ) {

                return;

            }


            try {

                const userRecord =
                    await auth.getUser(
                        after.uid
                    );


                const role =
                    String(
                        after.role ||
                        "Member"
                    )
                        .trim();


                const normalizedRole =
                    role.toLowerCase();


                const isAdmin =
                    normalizedRole === "admin" ||
                    normalizedRole === "super admin" ||
                    normalizedRole === "founder";


                /*
                 * Determine whether the account
                 * should be disabled.
                 */

                const normalizedStatus =
                    String(
                        after.status ||
                        ""
                    )
                        .toLowerCase();


                const shouldDisable =
                    normalizedStatus === "rejected" ||
                    normalizedStatus === "inactive" ||
                    normalizedStatus === "suspended" ||
                    normalizedStatus === "disabled";


                const updateData = {

                    displayName:
                        after.displayName ||
                        after.tiktokUsername ||
                        userRecord.displayName ||
                        "NIGHTFALL DEVILS Member",

                    disabled:
                        shouldDisable

                };


                /*
                 * If email changed, update it.
                 */

                if (
                    after.email &&
                    after.email !==
                    userRecord.email
                ) {

                    updateData.email =
                        String(
                            after.email
                        )
                            .trim()
                            .toLowerCase();

                }


                await auth.updateUser(
                    after.uid,
                    updateData
                );


                /*
                 * Update custom claims.
                 */

                await auth.setCustomUserClaims(
                    after.uid,
                    {

                        role:
                            role,

                        admin:
                            isAdmin,

                        memberId:
                            memberId

                    }
                );


                await event.data.after.ref.update({

                    authStatus:
                        shouldDisable
                            ? "disabled"
                            : "active",

                    updatedAt:
                        FieldValue.serverTimestamp()

                });


                console.log(
                    `Auth account updated for member ${memberId}`
                );


            } catch (error) {

                console.error(
                    `Failed updating Auth account for ${memberId}:`,
                    error
                );


                await event.data.after.ref.update({

                    authStatus:
                        "error",

                    authError:
                        error.message ||
                        "Unknown Firebase Authentication error.",

                    updatedAt:
                        FieldValue.serverTimestamp()

                });

            }

        }
    );

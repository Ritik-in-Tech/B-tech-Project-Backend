/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Register a new user
 *     description: Registers a user as an admin, student, or mess, based on the role and provided email.
 *     tags: [User Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, students, mess]
 *                 description: Role of the user.
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *               rollnumber:
 *                 type: string
 *                 description: Roll number for students (required for students only).
 *               password:
 *                 type: string
 *                 description: Password for the user (minimum 6 characters).
 *             required:
 *               - role
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "User registered successfully! Please check your email for the QR code"
 *                 data:
 *                   type: object
 *                   properties:
 *                     authToken:
 *                       type: string
 *                       description: Authorization token for the user.
 *       400:
 *         description: Bad request, e.g., missing required fields or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid role. Please choose between 'admin', 'students', or 'mess'"
 *                 data:
 *                   type: object
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: object
 */

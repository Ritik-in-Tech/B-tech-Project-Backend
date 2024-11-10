// addAnsiKey.swagger.js

/**
 * @swagger
 * /api/v1/user/add-ansi-key/:userId:
 *   post:
 *     summary: Add ANSI Key for a user
 *     description: Allows an admin to add an ANSI key and image URL to a user's profile. This endpoint is only accessible by an admin.
 *     tags:
 *       - Add Ansi Key for a user
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user for whom the ANSI key is being added.
 *         schema:
 *           type: string
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authorization.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ansiKey:
 *                 type: string
 *                 description: Encrypted ANSI key for the user.
 *                 example: "encrypted_key_12345"
 *               ansiImageUrl:
 *                 type: string
 *                 description: URL of the ANSI image.
 *                 example: "https://example.com/ansi_image.jpg"
 *     responses:
 *       200:
 *         description: Successfully added ANSI key for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: "User key added successfully"
 *       400:
 *         description: Bad request due to missing or invalid parameters
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
 *                   example: "Ansi Key or AnsiImageUrl is not provided in the body"
 *       403:
 *         description: Forbidden. Only admin role can access this resource.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "Only admin can add ansi Keys for the students"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error due to a database or server issue
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
 *                   example: "Failed to add user key"
 */

// chooseMess.swagger.js

/**
 * @swagger
 * /api/v1/mess/choose-mess:
 *   post:
 *     summary: Choose Mess
 *     description: Allows a student to select a mess facility (Old or New) for a specified date range. Only accessible by students.
 *     tags:
 *       - Mess
 *     parameters:
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
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date for the mess facility.
 *                 example: "2023-10-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date for the mess facility.
 *                 example: "2023-10-30"
 *               mess:
 *                 type: string
 *                 description: Mess facility name.
 *                 enum: ["Old", "New"]
 *                 example: "Old"
 *     responses:
 *       200:
 *         description: Mess date added successfully.
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
 *                   example: "200: Mess date added successfully!"
 *       400:
 *         description: Bad request due to missing or invalid parameters.
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
 *                   example: "400: Start, end Date or mess is not provided"
 *       403:
 *         description: Forbidden. Only students can access this resource.
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
 *                   example: "403: Only student can choose mess facility"
 *       404:
 *         description: User not found.
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
 *                   example: "404: User not found"
 *       409:
 *         description: Conflict. Mess facility already chosen for the specified date range.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "409: There is already chosen mess for the given user in the given span"
 *       500:
 *         description: Internal server error due to a database or server issue.
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
 *                   example: "500: Internal server error"
 */

import express from 'express';
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 公司
 *   description: 公司管理API
 */

// 所有路由都需要认证
router.use(protect);

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: 获取所有公司列表
 *     tags: [公司]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页记录数
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: 排序字段，例如 "name" 表示按公司名称排序
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: 返回的字段，用逗号分隔，例如 "name,industry,location"
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *         description: 按行业筛选
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [startup, small, medium, large, enterprise]
 *         description: 按公司规模筛选
 *     responses:
 *       200:
 *         description: 成功获取公司列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyListResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   post:
 *     summary: 创建新公司
 *     tags: [公司]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: 公司名称
 *                 example: 示例科技有限公司
 *               website:
 *                 type: string
 *                 description: 公司网站
 *                 example: https://example.com
 *               industry:
 *                 type: string
 *                 description: 行业
 *                 example: 信息技术
 *               size:
 *                 type: string
 *                 enum: [startup, small, medium, large, enterprise]
 *                 description: 公司规模
 *                 example: medium
 *               location:
 *                 type: string
 *                 description: 公司地点
 *                 example: 奥克兰, 新西兰
 *               description:
 *                 type: string
 *                 description: 公司描述
 *     responses:
 *       201:
 *         description: 公司创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.route('/')
  .get(getCompanies)
  .post(createCompany);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: 获取单个公司详情
 *     tags: [公司]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 公司ID
 *     responses:
 *       200:
 *         description: 成功获取公司详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   put:
 *     summary: 更新公司信息
 *     tags: [公司]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 公司ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 公司名称
 *               website:
 *                 type: string
 *                 description: 公司网站
 *               industry:
 *                 type: string
 *                 description: 行业
 *               size:
 *                 type: string
 *                 enum: [startup, small, medium, large, enterprise]
 *                 description: 公司规模
 *               location:
 *                 type: string
 *                 description: 公司地点
 *               description:
 *                 type: string
 *                 description: 公司描述
 *     responses:
 *       200:
 *         description: 公司更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *
 *   delete:
 *     summary: 删除公司
 *     tags: [公司]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 公司ID
 *     responses:
 *       200:
 *         description: 公司删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.route('/:id')
  .get(getCompany)
  .put(updateCompany)
  .delete(deleteCompany);

export default router; 
import Express from "express";

import {
  getAllExpenses,
  getSingleExpense,
  getSingleExpenseDetail,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseByDate,
  getExpenseByCategory,
} from "../controllers/expenses-controller.js";

const router = Express.Router();

router.route("/").get(getAllExpenses).post(createExpense);
router
  .route("/:id")
  .get(getSingleExpense)
  .put(updateExpense)
  .delete(deleteExpense);
router.route("/:id/detail").get(getSingleExpenseDetail);
router.route("/type/:category").get(getExpenseByCategory);
router.route("/total/date").get(getExpenseByDate);

export default router;

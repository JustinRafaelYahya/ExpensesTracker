import Express from "express";

import {
  getAllExpensesList,
  getExpenseDetails,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseByDate,
  getExpenseByCategory,
} from "../controllers/expenses-controller.js";

const router = Express.Router();

router.route("/").get(getAllExpensesList).post(createExpense);
router
  .route("/:id")
  .get(getExpenseDetails)
  .put(updateExpense)
  .delete(deleteExpense);
router.route("/totalcategory/:category").get(getExpenseByCategory);
router.route("/totaldate/date").get(getExpenseByDate);

export default router;

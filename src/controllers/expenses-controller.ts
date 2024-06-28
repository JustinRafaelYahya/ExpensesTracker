import { Response, Request } from "express";
import fs from "fs/promises";
const filePath = "./src/data/expenses.json";

async function getExpenses() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
  }
}

export async function getAllExpensesList(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const expensesAndIncomeList = expenses.map(
      (
        expense: { title: string; type: string; amount: number },
        index: number
      ) => {
        return `${index + 1}: ${expense.title} | type: ${
          expense.type
        } | amount: Rp. ${expense.amount.toLocaleString("id")}`;
      }
    );
    res.status(200).json({
      message: "Success getting all of the expenses and incomes list",
      expensesAndIncomeList,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getExpenseDetails(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const expense = expenses.find(
      (expense: { id: number }) => expense.id === Number(req.params.id)
    );

    const { id, title, date, type, category, details } = expense;
    const amount = `Rp. ${expense.amount.toLocaleString("id")}`;
    if (!expense) {
      res.status(404).json({ message: "Expense or Income not found" });
    }

    res.status(200).json({ id, title, date, type, category, amount, details });
  } catch (error) {
    console.error(error);
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const { title, date, type, amount, category, details } = await req.body;
    if (!title && !date && !type && !category && !amount && !details) {
      res.status(400).json({ message: "Required fields is missing" });
    }
    const expenses = await getExpenses();
    const expensesLastID = expenses.at(-1).id + 1;
    const newExpense = {
      id: expensesLastID,
      title,
      date,
      type,
      category,
      amount,
      details,
    };
    expenses.push(newExpense);
    await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
    res.status(201).json({
      message: "Successfully added new expense or income",
      newExpense,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();

    const expenseIndex = expenses.findIndex(
      (todo: { id: number }) => todo.id === Number(req.params.id)
    );
    const expense = expenses[expenseIndex];

    if (!expense) {
      res.status(404).json({ message: "Expense or Income not found" });
    }
    expenses[expenseIndex] = { ...expense, ...req.body };
    await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
    res.status(200).json({ message: "Update succesfull" });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();

    const expenseIndex = expenses.findIndex(
      (todo: { id: number }) => todo.id === Number(req.params.id)
    );

    if (expenseIndex === -1) {
      res.status(404).json({ message: "Expense or Income not found" });
    }

    expenses.splice(expenseIndex, 1);
    await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
    res.status(200).json({ message: "Delete succesfull" });
  } catch (error) {
    console.error(error);
  }
}

export async function getExpenseByCategory(req: Request, res: Response) {
  try {
    const category = req.params.category;
    const expenses = await getExpenses();
    let totalFilteredExpensesOrIncome = expenses
      .filter((expense: { category: string }) => expense.category === category)
      .reduce(
        (sum: number, expense: { amount: number }) => sum + expense.amount,
        0
      );

    if (!totalFilteredExpensesOrIncome) {
      res.status(404).json({ message: "Expense or Income category not found" });
    }

    totalFilteredExpensesOrIncome = `Rp. ${totalFilteredExpensesOrIncome.toLocaleString(
      "id"
    )}`;
    res.status(200).json({ totalFilteredExpensesOrIncome });
  } catch (error) {
    console.error(error);
  }
}

export async function getExpenseByDate(req: Request, res: Response) {
  try {
    let expenses = await getExpenses();
    const startDate = new Date(req.query.start as string);
    const endDate = new Date(req.query.end as string);
    let totalExpensesinPeriod = expenses
      .filter((expense: { date: string; type: string }) => {
        const expenseDate = new Date(expense.date as string);
        return (
          expenseDate >= startDate &&
          expenseDate <= endDate &&
          expense.type == "expense"
        );
      })
      .reduce(
        (sum: number, expense: { amount: number }) => sum + expense.amount,
        0
      );

    let totalIncomesinPeriod = expenses
      .filter((expense: { date: string; type: string }) => {
        const expenseDate = new Date(expense.date as string);
        return (
          expenseDate >= startDate &&
          expenseDate <= endDate &&
          expense.type == "income"
        );
      })
      .reduce(
        (sum: number, expense: { amount: number }) => sum + expense.amount,
        0
      );

    let totalProfitOrDeficitinPeriod =
      totalIncomesinPeriod - totalExpensesinPeriod;
    totalProfitOrDeficitinPeriod = `Rp. ${totalProfitOrDeficitinPeriod.toLocaleString(
      "id"
    )}`;
    totalIncomesinPeriod = `Rp. ${totalIncomesinPeriod.toLocaleString("id")}`;
    totalExpensesinPeriod = `Rp. ${totalExpensesinPeriod.toLocaleString("id")}`;

    res.status(200).json({
      totalIncomesinPeriod,
      totalExpensesinPeriod,
      totalProfitOrDeficitinPeriod,
    });
  } catch (error) {
    console.error(error);
  }
}

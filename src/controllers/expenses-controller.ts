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

export async function getAllExpenses(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    res
      .status(200)
      .json({ message: "Success getting all of the expenses list", expenses });
  } catch (error) {
    console.error(error);
  }
}

export async function getSingleExpense(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const expense = expenses.find(
      (expense: { id: number }) => expense.id === Number(req.params.id)
    );

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ expense });
  } catch (error) {
    console.error(error);
  }
}

export async function getSingleExpenseDetail(req: Request, res: Response) {
  try {
    const expenses = await getExpenses();
    const expense = expenses.find(
      (expense: { id: number }) => expense.id === Number(req.params.id)
    );

    const details = expense.details;

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ details });
  } catch (error) {
    console.error(error);
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const { title, date, amount, category, details } = await req.body;
    if (!title && !date && !amount && !category && !details) {
      res.status(400).json({ message: "Required fields is missing" });
    }
    const expenses = await getExpenses();
    const expensesLastID = expenses.at(-1).id + 1;
    const newExpense = {
      id: expensesLastID,
      title,
      date,
      amount,
      category,
      details,
    };
    expenses.push(newExpense);
    await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
    res
      .status(201)
      .json({ message: "Successfully added new expense", newExpense });
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
      res.status(404).json({ message: "Todo not found" });
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
      res.status(404).json({ message: "Todo not found" });
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
    const filteredExpenses = expenses.filter(
      (expense: { category: any }) => expense.category === category
    );

    if (!filteredExpenses) {
      res.status(404).json({ message: "Expense category not found" });
    }

    res.status(200).json({ filteredExpenses });
  } catch (error) {
    console.error(error);
  }
}

export async function getExpenseByDate(req: Request, res: Response) {
  try {
    let expenses = await getExpenses();
    const startDate = new Date(req.query.start as string);
    const endDate = new Date(req.query.end as string);
    const totalExpenses = expenses
      .filter((expense: any) => {
        const expenseDate = new Date(expense.date as string);
        return expenseDate >= startDate && expenseDate <= endDate;
      })
      .reduce((sum: any, expense: any) => sum + expense.amount, 0);

    if (!totalExpenses) {
      res.status(404).json({ message: "Total expenses cannot be calculated" });
    }

    res.status(200).json({ totalExpenses });
  } catch (error) {
    console.error(error);
  }
}

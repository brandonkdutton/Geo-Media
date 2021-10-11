import { createAsyncThunk } from "@reduxjs/toolkit";
import { Category, FetchError } from "../../types/postTypes";

export type FetchCategoriesResult = {
  categories: Category[];
  endOffsetId: number;
};

export const fetchCategories = createAsyncThunk<
  FetchCategoriesResult,
  number,
  { rejectValue: FetchError }
>("categories/fetchAll", async (offset: number, thunkApi) => {
  const req = await fetch(
    `${process.env.REACT_APP_API_URI}/categories?offset=${offset}`
  );

  if (req.status < 200 || req.status >= 400) {
    const error: FetchError = await req.json();
    thunkApi.rejectWithValue({ message: error.message });
  }

  const result: FetchCategoriesResult = await req.json();
  return result;
});

export const fetchCategoriesForLocation = createAsyncThunk<
  FetchCategoriesResult,
  number,
  { rejectValue: FetchError }
>("categories/fetchAtLocation", async (locId: number, thunkApi) => {
  const req = await fetch(
    `${process.env.REACT_APP_API_URI}/categories/atLocation/${locId}`
  );

  if (req.status < 200 || req.status >= 400) {
    const error: FetchError = await req.json();
    thunkApi.rejectWithValue({ message: error.message });
  }

  const result: FetchCategoriesResult = await req.json();
  return result;
});

export const createNewCategory = createAsyncThunk<
  Category,
  string,
  { rejectValue: FetchError }
>("categories/createNew", async (name: string, thunkApi): Promise<Category> => {
  const req = await fetch(
    `${process.env.REACT_APP_API_URI}/categories?name=${name}`,
    { method: "POST" }
  );

  if (req.status < 200 || req.status >= 400) {
    const error: FetchError = await req.json();
    thunkApi.rejectWithValue({ message: error.message });
  }

  const result: Category = await req.json();
  return result;
});

import {
  createSlice,
  createEntityAdapter,
  EntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Category } from "../../types/postTypes";
import {
  fetchCategories,
  createNewCategory,
  FetchCategoriesResult,
} from "../thunks/categoriesThunks";

type AdditionalState = {
  queryOffset: number;
  createPending: boolean;
  fetchPending: boolean;
  filterTags: Category[];
};
export type CategoriesState = EntityState<Category> & AdditionalState;

const categoriesAdapter: EntityAdapter<Category> =
  createEntityAdapter<Category>({
    sortComparer: (a, b) => a.name.localeCompare(b.name),
  });

const initialState: CategoriesState =
  categoriesAdapter.getInitialState<AdditionalState>({
    queryOffset: 0,
    createPending: false,
    fetchPending: false,
    filterTags: [],
  });

type Action<T> = { type: string; payload: T };

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setFilterTags(state: CategoriesState, action: Action<Category[]>) {
      state.filterTags = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCategories.fulfilled,
      (state: CategoriesState, action: Action<FetchCategoriesResult>) => {
        categoriesAdapter.upsertMany(state, action.payload.categories);
        state.queryOffset = action.payload.endOffsetId;
        state.fetchPending = false;
      }
    );
    builder.addCase(fetchCategories.pending, (state: CategoriesState) => {
      state.fetchPending = true;
    });
    builder.addCase(fetchCategories.rejected, (state: CategoriesState) => {
      state.fetchPending = false;
    });
    builder.addCase(
      createNewCategory.fulfilled,
      (state: CategoriesState, action: Action<Category>) => {
        categoriesAdapter.upsertOne(state, action.payload);
        state.createPending = false;
      }
    );
    builder.addCase(createNewCategory.pending, (state: CategoriesState) => {
      state.createPending = true;
    });
    builder.addCase(createNewCategory.rejected, (state: CategoriesState) => {
      state.createPending = false;
    });
  },
});

export const { setFilterTags } = categoriesSlice.actions;

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
} = categoriesAdapter.getSelectors((state: RootState) => state.categories);

export default categoriesSlice.reducer;

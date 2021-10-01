import {
  createEntityAdapter,
  createSlice,
  EntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import {
  fetchPostsForLocation,
  postPostsForLocation,
  postReplyForLocation,
} from "../thunks/postsThunks";
import { Post, Reply } from "../../types/postTypes";
import { RootState } from "../store";

type AdditionalState = {
  postsFetchPending: boolean;
  postPostPending: boolean;
  postReplyPending: boolean;
  replyingToId: number | null;
  expandedIds: number[];
};
type PostsState = EntityState<Post> & AdditionalState;

const postAdapter: EntityAdapter<Post> = createEntityAdapter<Post>({
  selectId: (entity: Post) => entity.postId,
  sortComparer: (entity: Post) => entity.postId * -1,
});

type Action<T> = { type: string; payload: T };

const initialState: PostsState = postAdapter.getInitialState<AdditionalState>({
  postsFetchPending: false,
  postPostPending: false,
  postReplyPending: false,
  replyingToId: null,
  expandedIds: [],
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setReplyingToId(state: PostsState, action: Action<number | null>) {
      state.replyingToId = action.payload;
    },
    addToExpanded(state: PostsState, action: Action<number>) {
      state.expandedIds.push(action.payload);
    },
    removeFromExpanded(state: PostsState, action: Action<number>) {
      const newExpandedIds = state.expandedIds.filter(
        (x: number) => x !== action.payload
      );
      state.expandedIds = newExpandedIds;
    },
  },
  extraReducers: (builder) => {
    // fetch posts cases
    builder.addCase(
      fetchPostsForLocation.fulfilled,
      (state: PostsState, action: Action<Post[]>) => {
        const posts: Post[] = action.payload;
        postAdapter.removeAll(state);
        postAdapter.upsertMany(state, posts);
        state.postsFetchPending = false;
        state.expandedIds = [];
        state.replyingToId = null;
      }
    );
    builder.addCase(fetchPostsForLocation.pending, (state: PostsState) => {
      state.postsFetchPending = true;
    });
    builder.addCase(
      fetchPostsForLocation.rejected,
      (state: PostsState, action) => {
        if (action.meta.arg.offset === -1) {
          postAdapter.removeAll(state);
        }
        state.postsFetchPending = false;
        state.expandedIds = [];
        state.replyingToId = null;
      }
    );
    // post new post cases
    builder.addCase(
      postPostsForLocation.fulfilled,
      (state: PostsState, action: Action<Post>) => {
        const newPost = action.payload;
        postAdapter.upsertOne(state, newPost);
        state.postPostPending = false;
      }
    );
    builder.addCase(postPostsForLocation.pending, (state: PostsState) => {
      state.postPostPending = true;
    });
    builder.addCase(postPostsForLocation.rejected, (state: PostsState) => {
      state.postPostPending = false;
    });
    builder.addCase(
      postReplyForLocation.fulfilled,
      (state: PostsState, action: Action<Reply>) => {
        debugger;
        const updatedReplies = state.entities[action.payload.postId]?.replies;
        updatedReplies?.push(action.payload);

        if (updatedReplies)
          postAdapter.updateOne(state, {
            id: action.payload.postId,
            changes: { replies: updatedReplies },
          });
        state.postReplyPending = false;
      }
    );
    builder.addCase(postReplyForLocation.pending, (state: PostsState) => {
      state.postReplyPending = true;
    });
    builder.addCase(postReplyForLocation.rejected, (state: PostsState) => {
      state.postReplyPending = false;
    });
  },
});

export const {
  selectAll: selectAllPostsForCurrentLocation,
  selectById: selectPostByIdForCurrentLocation,
  selectIds: selectPostIdsForCurrentLocation,
} = postAdapter.getSelectors((state: RootState) => state.posts);

export const { setReplyingToId, addToExpanded, removeFromExpanded } =
  postsSlice.actions;

export default postsSlice.reducer;

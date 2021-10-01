from back_end.api.db import get_db


def generate_cat_str(cats):
    """generates a string of %s 's that is as long as the number of elements in cats"""
    q_cat_str = "(" + ("".join("%s, " for _ in range(len(cats))))[0:-2] + ")"
    return q_cat_str


def query(limit, cats, loc_id):
    """
    Handles the implementation details for the Posts get query.
    Runs the specific query needed to fetch posts given the provided limit, loc_id, and filter categories
    """

    db = get_db()
    cursor = db.cursor()

    if limit == -1 and cats[0] == "":
        q = """ 
            select UserPosts.postId, UserPosts.userId, userName, postTitle, postContent, locId, createdAt from UserPosts
                join Users on Users.userId = UserPosts.userId
                where UserPosts.locId = %s
                group by UserPosts.postId
                order by UserPosts.postId desc limit 15;
            """
        result = cursor.execute(q, (loc_id))
    elif limit != -1 and cats[0] != "":
        q = f""" 
            select UserPosts.postId, UserPosts.userId, userName, postTitle, postContent, locId, createdAt from UserPosts
                join Users on Users.userId = UserPosts.userId
                join PostCategories on UserPosts.postId = PostCategories.postId
                where UserPosts.locId = %s and PostCategories.categoryId in {generate_cat_str(cats)} and UserPosts.postId <= %s
                group by UserPosts.postId
                order by UserPosts.postId desc limit 15; 
        """
        result = cursor.execute(q, (loc_id, *cats, limit))
    elif limit != -1 and cats[0] == "":
        q = """
            select UserPosts.postId, UserPosts.userId, userName, postTitle, postContent, locId, createdAt from UserPosts
                join Users on Users.userId = UserPosts.userId
                where UserPosts.locId = %s and UserPosts.postId <= %s
                group by UserPosts.postId
                order by UserPosts.postId desc limit 15; 
        """
        result = cursor.execute(q, (loc_id, limit))
    elif limit == -1 and cats[0] != "":
        q = f""" 
            select UserPosts.postId, UserPosts.userId, userName, postTitle, postContent, locId, createdAt from UserPosts
                join Users on Users.userId = UserPosts.userId
                join PostCategories on UserPosts.postId = PostCategories.postId
                where UserPosts.locId = %s and PostCategories.categoryId in {generate_cat_str(cats)}
                group by UserPosts.postId
                order by UserPosts.postId desc limit 15; 
        """
        result = cursor.execute(q, (loc_id, *cats))
    else:
        result = None

    data = cursor.fetchall()
    return data


def query_categories(post_id):
    """Fetches categories for a post given a post id"""
    db = get_db()
    cursor = db.cursor()

    q = """ 
        select Categories.categoryId, categoryName from Categories
            join PostCategories on Categories.categoryId = PostCategories.categoryId
            where PostCategories.postId = %s;
    """
    cursor.execute(q, post_id)
    data = cursor.fetchall()
    return data


def query_replies(post_id):
    """Fetches replies for a post given a post_id"""

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        select replyId, Users.userId, Users.userName, replyContent, createdAt from UserReplies
            join Users on Users.userId = UserReplies.userId
            where UserReplies.postId = %s
            order by replyId asc
        """,
        post_id,
    )
    return cursor.fetchall()

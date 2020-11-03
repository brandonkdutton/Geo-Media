def test_post_data():
    return [
        {
            'loc_id': 1,
            'user_id': 1,
            'parent_id': -1,
            'content': 'post 1. no parent loc 1'
        },
        {
            'loc_id': 1,
            'user_id': 2,
            'parent_id': -1,
            'content': 'post 2. no parent loc 1'
        }, 
        {
            'loc_id': 1,
            'user_id': 2,
            'parent_id': 1,
            'content': 'post 3. reply to 1. loc 1'
        },
        {
            'loc_id': 1,
            'user_id': 1,
            'parent_id': 6,
            'content': 'post 4. reply to 4. loc 1'
        }, 
        {
            'loc_id': 1,
            'user_id': 2,
            'parent_id': 2,
            'content': 'post 5. reply to 2. loc 1'
        },    
        {
            'loc_id': 1,
            'user_id': 2,
            'parent_id': 1,
            'content': 'post 6. reply to 1. loc 1'
        },    
        {
            'loc_id': 1,
            'user_id': 1,
            'parent_id': 6,
            'content': 'post 7. reply to 7. loc 1'
        },   
    ]
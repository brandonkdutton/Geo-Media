from collections import defaultdict
import json

class PostObj:

    def __init__(self, posts):
        """ Store the raw post data in a hash table with keys being the parent id """

        self.posts = defaultdict(list)

        if posts is not None:
            for post in posts:
                self.posts[post[2]].append(post)

    def recur_to_json(self, root_post):
        """ build the post json data that can be recursiveley rendered """
        """ Returns list of dicts of formated post data """

        obj_list = []
        root_id = root_post[0]

        for child_post in self.posts[root_id]:
            current_post_obj = (
                {
                    'post_id': child_post[0],
                    'username': child_post[4],
                    'timestamp': str(child_post[5]),
                    'content': child_post[6],
                    'replies': self.recur_to_json(child_post)
            
                }
            )
            obj_list.append(current_post_obj)
        return obj_list

    def to_json(self):
        """ Helper function to call self.recur_to_json """
        """ Returns list of dicts of root posts """

        obj_list = []
        for root_post in self.posts[-1]:
            tmp = {
                'post_id': root_post[0],
                'username': root_post[4],
                'timestamp': str(root_post[5]),
                'content': root_post[6],
                'replies': self.recur_to_json(root_post)
            }
            obj_list.append(tmp)


        return obj_list

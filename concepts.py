import sys
import json
import ast


import numpy as np
import pandas as pd
import sys
import pyalex
from pyalex import Works, Authors, Concepts, Institutions

#print("Output from Python")
#test = []
#test.append(sys.argv[1])
#test.append("Physics")
#sys.argv[1]

ret_list = []
imp_concept_list = []
c = Concepts().search_filter(display_name = sys.argv[1]).sort(cited_by_count="desc").get()
works_list = []
end = len(c)
if len(c) > 6:#3
  end = 6#3

for i in range(end):
  concept = c[i]
  display_name = concept["display_name"]
  id = concept["id"]
  imp_concept_list.append((display_name, concept["works_count"], concept["cited_by_count"]))
  w = Works().filter(concepts={"id": id}).get()

  w_end = len(w)
  if len(w) > 10: #10
    w_end = 10#10
  for j in range(w_end):
    work = w[j]
    title = work["title"]
    w_type = work["type"]
    publication_year = work["publication_year"]
    lpu = work["locations"]
    cite = work["cited_by_count"]
    final_url = ""
    for x in lpu:
      a = x["landing_page_url"]
      b = x["pdf_url"]
      if a != None:
        final_url = a
        break
      elif b != None:
        final_url = b
        break 
    
    author_list = []
    for a in work["authorships"]:
      author_list.append(a["author"]["display_name"])
    works_list.append((title, w_type, publication_year, final_url, author_list, cite))
ret_list.append(works_list)
ret_list.append(imp_concept_list)
ret_list.append(len(works_list))

ret_this = json.dumps(ret_list)
print(ret_this, end="", flush=True)
#sys.stdout.flush()


# import numpy as np
# import pandas as pd
# import sys
# # import pyalex

# # from pyalex import Works, Authors, Concepts, Institutions


# def concepts_works(concept_name):
#   c = Concepts().search_filter(display_name = concept_name).sort(cited_by_count="desc").get()

#   works_list = []
#   end = len(c)
#   if len(c) > 4:
#     end = 4

#   for i in range(end):
#     concept = c[i]
#     display_name = concept["display_name"]
#     id = concept["id"]
#     w = Works().filter(concepts={"id": id}).get()

#     w_end = len(w)
#     if len(w) > 10:
#       w_end = 10
#     for j in range(w_end):
#       work = w[j]
#       title = work["title"]
#       w_type = work["type"]
#       publication_year = work["publication_year"]
#       author_list = []
#       for a in work["authorships"]:
#         author_list.append(a["author"]["display_name"])
#       works_list.append((title, w_type, publication_year, author_list))

#   print(works_list)
#   print("hi this is the input : " + sys.argv[1])
#   #return works_list






# import sys
# import json

# data_send = "take this node"

# input = sys.argv[1]

# output = len(concepts_works("chemistry"))# data_send
# print(json.dumps(output))

# sys.stdout.flush()
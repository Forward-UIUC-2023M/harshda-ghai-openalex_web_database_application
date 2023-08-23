import sys
import json
import ast


import numpy as np
import pandas as pd
import sys
import pyalex
from pyalex import Works, Authors, Concepts, Institutions

def works_helper(works_id):
  w = Works()[works_id] 
  title = w["title"]
  w_type = w["type"]
  publication_year = w["publication_year"]
  cite = w["cited_by_count"]
  lpu = w["locations"]
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
  for a in w["authorships"]:
    author_list.append(a["author"]["display_name"])

  return (title, w_type, publication_year, final_url, author_list, cite)


ret_list = []
related_works_list = []
w_search = Works().search_filter(display_name = sys.argv[1]).sort(cited_by_count="desc").get()

works_list = []
end = len(w_search)
if (len(w_search) > 60):
    end = 60

for i in range(end):
    work = w_search[i]
    id = work["id"]
    title = work["title"]
    w_type = work["type"]
    publication_year = work["publication_year"]
    cite = work["cited_by_count"]
    lpu = work["locations"]
    #related_works_list.extend(work["related_works"])
    related_works_list.append(works_helper(work["related_works"][0]))
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
ret_list.append(related_works_list)

ret_this = json.dumps(ret_list)
print(ret_this, end="", flush=True)
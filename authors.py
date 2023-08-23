import sys
import json
import ast


import numpy as np
import pandas as pd
import sys
import pyalex
from pyalex import Works, Authors, Concepts, Institutions


ret_list = []
imp_author_list = []
author_main = Authors().search_filter(display_name = sys.argv[1]).sort(cited_by_count="desc").get()

works_list = []
end = len(author_main)
if len(author_main) > 6:
    end = 6

for i in range(end):
    author = author_main[i]
    display_name = author["display_name"]
    id = author["id"]
    imp_author_list.append((display_name, author["works_count"], author["cited_by_count"]))
    w = Works().filter(author={"id": id}).get()

    w_end = len(w)
    if len(w) > 10:
        w_end = 10
    for j in range(w_end):
        work = w[j]
        title = work["title"]
        w_type = work["type"]
        publication_year = work["publication_year"]
        cite = work["cited_by_count"]
        lpu = work["locations"]
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
ret_list.append(imp_author_list)


ret_this = json.dumps(ret_list)
print(ret_this, end="", flush=True)
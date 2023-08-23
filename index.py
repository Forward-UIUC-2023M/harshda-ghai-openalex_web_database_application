import sys
import json
import ast


import numpy as np
import pandas as pd
import sys
import pyalex
from pyalex import Works, Authors, Concepts, Institutions



final_list = []

def author_works(author_name):
  ret_list = []
  imp_author_list = []
  author_main = Authors().search_filter(display_name = author_name).sort(cited_by_count="desc").get()

  works_list = []
  end = len(author_main)
  if len(author_main) > 3:
    end = 3

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
  return ret_list


a_list = author_works(sys.argv[1])
if (len(a_list[0]) != 0):
  final_list.extend(a_list[0][:15])



def inst_works(inst_name):
  ret_list = []
  imp_inst_list = []
  c = Institutions().search_filter(display_name = inst_name).sort(cited_by_count="desc").get()

  works_list = []
  end = len(c)
  if len(c) > 3:
    end = 3

  for i in range(end):
    inst = c[i]
    display_name = inst["display_name"]
    id = inst["id"]
    imp_inst_list.append((display_name, inst["works_count"], inst["cited_by_count"]))
    w = Works().filter(institutions={"id": id}).get()

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
  ret_list.append(imp_inst_list)
  return ret_list


i_list = inst_works(sys.argv[1])
if (len(i_list[0]) != 0):
  final_list.extend(i_list[0][:15])



def concepts_works(concept_name):
  ret_list = []
  imp_concept_list = []
  c = Concepts().search_filter(display_name = concept_name).sort(cited_by_count="desc").get()

  works_list = []
  end = len(c)
  if len(c) > 3:
    end = 3

  for i in range(end):
    concept = c[i]
    display_name = concept["display_name"]
    id = concept["id"]
    imp_concept_list.append((display_name, concept["works_count"], concept["cited_by_count"]))
    w = Works().filter(concepts={"id": id}).get()

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
  ret_list.append(imp_concept_list)
  return ret_list


c_list = inst_works(sys.argv[1])
if (len(c_list[0]) != 0):
  final_list.extend(c_list[0][:15])




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


def works_func(work_name):
  ret_list = []
  related_works_list = []
  w_search = Works().search_filter(display_name = work_name).sort(cited_by_count="desc").get()

  works_list = []
  end = len(w_search)
  if (len(w_search) > 10):
    end = 10

  for i in range(end):
    work = w_search[i]
    #display_name = work["display_name"]
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
  return ret_list



w_list = works_func(sys.argv[1])
if (len(w_list[0]) != 0):
  final_list.extend(w_list[0][:15])


ret_this = json.dumps(final_list)
print(ret_this, end="", flush=True)



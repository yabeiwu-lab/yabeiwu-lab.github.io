---
title:
date: 2026-06-10
type: landing

sections:
  - block: hero
    content:
      title: 材料物理与智能计算课题组
      image:
        filename: welcome.jpg
      text: |
        <br>

        我们利用高性能计算与量子力学方法理解材料结构与物性之间的规律，重点研究 **二维材料电子结构、功能材料介电与铁电性质，以及机器学习材料设计**。

        {{% cta cta_link="./research/" cta_text="了解研究方向 →" %}}

  - block: collection
    content:
      title: 最新动态
      count: 5
      filters:
        author: ''
        category: ''
        exclude_featured: false
        publication_type: ''
        tag: ''
      offset: 0
      order: desc
      page_type: post
    design:
      view: card
      columns: '1'

  - block: collection
    content:
      title: 最新论文
      text: ''
      count: 6
      filters:
        folders:
          - publication
        publication_type: ''
    design:
      view: citation
      columns: '1'

  - block: markdown
    content:
      title:
      subtitle:
      text: |
        {{% cta cta_link="./people/" cta_text="认识团队成员 →" %}}
    design:
      columns: '1'
---

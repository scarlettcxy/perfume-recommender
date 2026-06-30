import type { StyleCategory } from "../types";

export const styleCategoryLabels: Record<StyleCategory, string> = {
  seasons: "季节",
  occasions: "场景",
  schools: "流派",
  olfactive: "气味标签",
  performance: "表现力",
};

export const styleTaxonomy: Record<StyleCategory, string[]> = {
  seasons: ["春日", "夏日", "秋冬", "四季", "雨天", "夜晚"],
  occasions: ["通勤", "约会", "正式", "度假", "睡前", "聚会"],
  schools: ["商业经典", "沙龙香", "白花", "美食调", "水生", "东方调", "馥奇"],
  olfactive: [
    "醛香",
    "清新",
    "干净",
    "皂感",
    "绿意",
    "茶感",
    "木质",
    "花香",
    "白花",
    "果香",
    "粉感",
    "甜感",
    "辛辣",
    "烟熏",
    "奶感",
    "麝香",
    "皮革",
    "动物感",
  ],
  performance: ["轻盈", "柔和", "明亮", "有存在感", "扩散强", "留香久", "贴肤"],
};

export const familyOptions = [
  "醛香花香调",
  "柑橘馥奇调",
  "果香馥奇调",
  "花香调",
  "花果香调",
  "白花调",
  "木质调",
  "木质馥奇调",
  "木质花香调",
  "东方馥奇调",
  "东方花香调",
  "东方香草调",
  "东方木质调",
  "水生调",
  "绿叶调",
  "皮革调",
  "琥珀调",
];

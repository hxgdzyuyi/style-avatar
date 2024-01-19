# style-avatar

## 术语

- accessory/accessories 配件
    - accessory_url, 资源有属性 url
    - accessory_slug, Slug 值
    - trait_type, 特征类型
- trait_type 特征，一张图由几个特征部分组成

trait_key -> style_key -> component_key -> accessory
衣服 -> 衣服7 -> 部件1 -> 颜色

## styles
{
  key: "{style_key}",
  trait_key: "衣服",
  preview_url: "", // webp 预览图，合并后
  components: [
    {
      type: "component",
      key: "部件1",
      label: "部件1",
      components: []
    },
    {
      type: "accessory",
      label: "颜",
      key: "颜",
    },
  ]
}

## accessories
{
  key: "{trait_key}_{style_key}_{component_key}_{color_key}",
  path: ["{trait_key}", "{style_key}", "{component_key}", "{color_key}"],
  url: "", // png 资源地址
  traitKey: "衣服",
  styleKey: "衣服7",
  z_index: 1,
  style_display_order: 1, 显示顺序
  component_display_order: 1, 显示顺序
}

## TODO

1. [x] 添加 sass 脚手架
2. [x] 添加 boostrap layout css
3. [x] 定义头像的 trait_name 部分: top, bottom, hats, face, left hand, right hand, full outfit， 符合一定的 z-index
4. [x] 用 nft 的属性方式生成 accessories.json，文件目录使用 {trait_name}/{accessory_slug}.png 的方式存放
5. [x] 添加 redux, 载入 rootTree 和 allAccessories
6. [x] 添加头像 AvatarCanvas 组件，使用 canvas，头像示意图有默认底图构成，处理 zIndex， 通过 accessoryIds: ["basic_background_001", "basic_body_001"] 生成头像
7. [x] 生成左侧 Tab，Tab 内容是 trait_name 的列表，TabContent 是头像示意图
8. [x] 生成右侧的可编辑区域的 HTML/CSS 结构
9. [x] PC 端右侧底部, 部添加 Wearing 弹框，描述现有配件，可进行联动
10. [x] PC 端右侧底部, 添加 Download 按钮，通过 toDataURL 生成图片
11. [x] PC 端右侧右列, 添加 Download Icon ，通过 toDataURL 生成图片
12. [x] PC 端右侧右列, 添加 Redo, Undo 逻辑
13. [x] PC 端右侧右列, 添加 Random 按钮, Random 可 Undo
14. [x] Mobile 适配，Preview 面板适配
15. [x] Mobile 适配，Panel 头部导航适配
16. [x] Undo/Redo 和选择器以及配件 Dialog 的冲突
17. [x] 完成部署脚本
18. [ ] 连续提交相同样式，会触发 undoList 添加两次同样元素
19. [ ] 修复预览图片的问题
20. [ ] 调整导出图片大小

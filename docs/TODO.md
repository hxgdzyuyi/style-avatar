# style-avatar

## 术语

- accessory/accessories 配件
    - accessory_url, 资源有属性 url
    - accessory_slug, Slug 值
    - trait_type, 特征类型
- trait_type 特征，一张图由几个特征部分组成

## TODO

1. [x] 添加 sass 脚手架
2. [ ] 添加 boostrap layout css
3. [ ] 定义头像的 trait_type 部分: top, bottom, hats, face, left hand, right hand, full outfit， 符合一定的 z-index
4. [ ] 用 nft 的属性方式生成 accessories.json，文件目录使用 {trait_type}/{accessory_slug}.png 的方式存放
5. [ ] 添加 redux ，将 accessories 列表，根据 trait_type 进行 group
6. [ ] 添加头像 AvatarCanvas 组件，使用 canvas，头像示意图有默认底图构成，处理 zIndex， 通过 accessoryIds: ["basic_background_001", "basic_body_001"] 生成头像
7. [ ] 生成左侧 Tab，Tab 内容是 trait_type 的列表，TabContent 是头像示意图
8. [ ] 生成右侧的可编辑区域
9. [ ] PC 端右侧底部, 部添加 Wearing 弹框，描述现有配件，可进行联动
10. [ ] PC 端右侧底部, 添加 Download 按钮，通过 toDataURL 生成图片
11. [ ] PC 端右侧右列, 添加 Download Icon ，通过 toDataURL 生成图片
12. [ ] PC 端右侧右列, 添加 Redo, Undo 逻辑
13. [ ] PC 端右侧右列, 添加 Random 按钮, Random 可 Undo
14. [ ] 处理特殊独占组件的显示规则
15. [ ] 适配 Moble 端

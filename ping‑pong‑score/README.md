# 乒乓球记分器 FusionApp Web项目
FusionApp网页版乒乓球计分工具。

## 功能
- 双方计分加减
- 自动判断局胜利条件（11分，净胜2分）
- 记录胜局数
- 支持赛制选择：3局2胜 /5局3胜 /7局4胜 /不限局数
- 自动发球轮换，支持手动切换发球方
- 比赛计时器
- 重置本局 /全部清零
- 交换双方选手（名字、颜色、胜局互换）

## FusionApp导入方法
1. 下载完整项目zip并解压
2. FusionApp → 导入项目 → 选择解压后的**整个文件夹**
> ❗不要单独导入index.html，必须导入整个文件夹，依赖fa.project.json识别。

## Github上传注意
提交全部文件：
`fa.project.json`、`index.html`、`css/`、`js/`、`res/`

不要只上传单个html文件，否则FusionApp打开布局残缺。

## 版本
v1.0.0

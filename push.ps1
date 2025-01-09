
# 设置仓库名称和路径
$repoName = "ChromePlayer"
$remoteRepoPath = "https://github.com/mingming-ctr/ChromePlayer.git"  # 请替换为您希望创建的远程仓库的路径

# 创建裸仓库作为远程仓库
git init --bare $remoteRepoPath

# 在本地创建一个新的 Git 仓库
New-Item -ItemType Directory -Path $repoName
Set-Location -Path $repoName
git init

# 添加示例文件
"#$repoName" | Out-File -FilePath "README.md"
git add README.md
git commit -m "Initial commit"

# 将本地仓库与远程仓库连接
git remote add origin $remoteRepoPath

# 推送到远程仓库
git push -u origin master

Write-Host "本地 Git 仓库和远程仓库已成功创建并连接！"
# Story Travel（読解英語ゲーム）公開手順

## フォルダ構成
```
.
├── index.html                     ← アプリ本体
├── netlify.toml                   ← Netlify設定
└── netlify/
    └── functions/
        └── claude.js               ← Anthropic APIへの安全なプロキシ（サーバーレス関数）
```

`index.html` 内のAI機能（本文生成・単語の意味・日本語訳）は、直接Anthropic APIキーを
書き込むのではなく `/.netlify/functions/claude` を経由するように変更済みです。
APIキーはNetlifyの環境変数として登録するので、コードにもGitHubにも一切残りません。

---

## 1. GitHubにリポジトリを作る

1. https://github.com にログイン → 右上の「+」→「New repository」
2. リポジトリ名を決める（例: `story-travel`）→ Public/Privateどちらでも可 → 「Create repository」
3. 自分のパソコンで、このフォルダ一式を使ってプッシュ：

```bash
cd (このdeployフォルダ)
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/【あなたのユーザー名】/story-travel.git
git push -u origin main
```

（GitHub Desktopなど画面操作のツールをお使いでも構いません）

---

## 2. Netlifyでサイトを作る

1. https://app.netlify.com にログイン（GitHubアカウントでログイン可）
2. 「Add new site」→「Import an existing project」
3. 「Deploy with GitHub」を選び、先ほどのリポジトリ（story-travel）を選択
4. ビルド設定はそのままでOK（`netlify.toml` が自動で読み込まれます）
5. 「Deploy site」をクリック

これで一旦サイトは公開されますが、まだAPIキーが未設定なので本文生成は動きません。

---

## 3. APIキーを環境変数として設定する

1. Netlifyのサイト管理画面 →「Site configuration」→「Environment variables」
2. 「Add a variable」をクリック
3. Key: `ANTHROPIC_API_KEY`　Value: 取得したAPIキー（`sk-ant-...`）を貼り付け
4. 保存後、「Deploys」タブ →「Trigger deploy」→「Deploy site」で再デプロイ
   （環境変数は再デプロイしないと反映されません）

---

## 4. 動作確認

再デプロイが終わったら、Netlifyが発行したURL（例: `https://story-travel-xxxx.netlify.app`）
を開き、実際に「ゲームを始める」を押して本文が生成されるか確認してください。

もし本文生成でエラーになる場合：
- Netlifyの「Functions」タブでログを確認（`ANTHROPIC_API_KEY未設定` などのエラーが出ていないか）
- Anthropic Console側でクレジット残高が0になっていないか確認

---

## 独自ドメインにしたい場合
Netlifyの「Domain management」から独自ドメインを追加できます（無料のnetlify.app
サブドメインのままでも問題なく使えます）。

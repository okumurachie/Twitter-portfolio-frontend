# Twitter風SNSアプリ - (Frontend)

## 概要

Twitter風の簡易SNSアプリのフロントエンドです。
Nuxt 4 を使用してUIを構築し、LaravelのBackend APIと連携しています。

## トップ画面

![トップ画面](./docs/top.png)

## 作成した目的

- LaravelとNuxtのAPI連携によるモダンなWebアプリ構成の理解
- Firebase Authenticationを用いたトークン認証の実装経験
- フロントエンド／バックエンド分離構成での開発演習

## 関連リポジトリ

- Frontend: https://github.com/okumurachie/Twitter-frontend
- Backend: https://github.com/okumurachie/Twitter-backend

## アプリケーションURL

※ 本アプリはローカル環境での動作を前提としています。デプロイは行っていません。

## 使用技術

- Nuxt 4(Vue 3)
- Pinia(状態管理)
- Firebase 12系(認証)
- vee-validate + yup(フォームバリデーション)
- REST API（Laravel連携）

## 主な機能

- Firebase Authentication（フロント側ログイン管理）
- 投稿の一覧表示
- 投稿作成・削除(認証ユーザーのみ)
- いいね機能(重複防止)
- コメント機能
- 投稿作成・削除・コメント追加・いいね機能は認証ユーザーのみ操作可能
- 非同期通信(API連携)
- 状態管理(ログイン状態保持)
- 自身の投稿のみ削除可能

## UI設計

- Twitter/X ライクな SNS UI を Nuxt 4 で実装
- PC / スマートフォン両対応（レスポンシブ）
- スマートフォン表示では、ナビゲーション簡略化
- コンポーネント設計を意識し、責務分離を実施

## 工夫した点

1. スマートフォン表示ではサイドバーを非表示、ハンバーガーメニュークリックでサイドメニューを開閉
    - SNSアプリはスマートフォンから利用されることが多いと考え、スマートフォンでの操作性を意識してUIを調整しました。
2. Vueコンポーネントの分割
    - 再利用性は保守性を考え、投稿フォームを独立したコンポーネントに切り出すなど、コンポーネントの役割を分けました。コードの可読性と、将来的に機能追加や修正がしすい構成を意識しました。投稿機能は複数の画面で使われる可能性もあるので、投稿フォームを独立したコンポーネントにしておくことで、
      別画面でも再利用できるようにしました。
    - フロントエンドでは、UIの見た目だけではなく、再利用性や保守性を高めることも意識しました。

## アーキテクチャ

本アプリは、フロントエンドとバックエンドを分離したSPA構成で開発しています。

### 構成概要

- フロントエンド： Nuxt(SPA)
  -- UI表示、ユーザー操作を担当
- バックエンド： Laravel(APIサーバー)
  -- データ処理、ビジネスロジックを担当
- 認証： Firebase Authentication
  -- ユーザー認証およびIDトークン発行

### データフロー

```mermaid
flowchart TD
    A[ユーザー] --> B[Nuxt SPA ]

    B -->|ログイン| C[Firebase Authentication]
    C -->|IDトークン| B

    B -->|API通信| D[Laravel API]
    D -->|DB操作| E[MySQL]

    style B fill:#d0ebff, color:#000
    style C fill:#ffe066, color:#000
    style D fill:#d3f9d8, color:#000
```

### 処理の流れ

1. ユーザーがNuxtアプリからログイン
2. Firebase Authenticationで認証を行い、IDトークンを取得
3. フロントエンドからLaravel APIへリクエスト送信(Bearerトークン付き)
4. Laravel側でトークンを検証し、認証済みユーザーのみ処理を許可
5. 問題がなければMySQLに対してデータの取得・保存を実行

### 設計意図

- フロントとバックエンドを分離することで、それぞれの責務を明確化
- Firebase Authenticationを利用することで、安全なトークン認証を実現
- SPA構成より、快適なユーザー体験を提供

## 技術選定理由

- Firebase Authenticationを採用した理由
- セキュアな認証機能を短期間で実装できるため
- トークンベース認証をSPA構成と相性良く扱えるため

## 今後の課題

- 今回は、SNSアプリの限定的な機能のみの実装までとなっていますが、画像の投稿や、フォロー、通知機能など、実際のアプリで使われている機能も実装したい

## 開発環境

- Node.js 18.x 以上
- npm (Node付属)

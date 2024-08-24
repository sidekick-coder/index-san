// https://github.com/nuxt-themes/docus/blob/main/nuxt.schema.ts
export default defineAppConfig({
    docus: {
        title: 'Index-san',
        description: 'Powerfull note-taking with the power of coding',
        image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png',
        socials: {
            github: 'sidekick-coder/index-san',
        },
        github: {
            dir: 'apps/docs',
            branch: 'main',
            repo: 'index-san',
            owner: 'sidekick-coder',
            edit: true,
        },
        aside: {
            level: 0,
            collapsed: false,
            exclude: [],
        },
        main: {
            padded: true,
            fluid: true,
        },
        header: {
            logo: true,
            showLinkIcon: true,
            exclude: [],
            fluid: true,
        },
    },
})

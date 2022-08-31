import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import Users from 'db/models/User'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_APP_GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
    FacebookProvider({
      clientId: process.env.NEXT_APP_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.NEXT_APP_FACEBOOK_CLIENT_SECRET,
    }),
  ],
  jwt: {
    encryption: true,
  },
  secret: process.env.NEXT_APP_SECRET_TOKEN,
  callbacks: {
    async signIn({ user, account }) {
      return Users.findOne({ where: { email: user.email } }).then((res) => {
        const userBody = {
          name: user.name,
          access_token: account.access_token,
          email: user.email,
          image: user.image,
        }
        return res === null ? Users.create(userBody).then(() => true).catch(() => false) : true
      }).catch(() => false)
    },
    redirect: async (url) => url.url,
  },
})
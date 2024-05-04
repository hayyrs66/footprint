import Google from "@auth/core/providers/google";
import { defineConfig } from "auth-astro";

export default defineConfig({
  providers: [
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/drive.metadata.readonly",
          ].join(" "),
        },
      },
    }),
  ],

  callbacks: {

    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        accessToken: token.accessToken,
      }
    }),

    jwt: ({ token, account, profile }) => {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
    
  },
});


/* 

  async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.user.id = token.sub
      
      return session
    },
    
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.sub = profile.id
      }
      return token
    }

*/
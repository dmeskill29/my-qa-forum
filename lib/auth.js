import { db } from '@/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials' // Import CredentialsProvider
import bcrypt from 'bcrypt'

export const authOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // Add CredentialsProvider for email and password authentication
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Email and Password',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john.doe@example.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        
        // Check if the user exists and verify the password
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // Passwords match
          return user;
        } else {
          // User not found or password does not match
          return null;
        }
      }
    }),
  ],
  database: process.env.DATABASE_URL,
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
        session.user.roles = token.roles
      }

      return session
    },

    async jwt({ token, user }) {
      
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        token.id = user.id
        return token
      }

      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        })
      }

      if (user && dbUser && !dbUser.keychainId) { // Assuming the field is `keychainId` and exists on `dbUser`
        try {
          // Create a new keychain record and link it to the user
          const keychainResult = await db.keyChain.create({
            data: {
              user: {
                connect: { id: user.id },
              },
            },
          });
      
          // Update the user record with the new keychainId
          // This step might be unnecessary if your Prisma schema automatically handles the relation
          // based on how you defined the models and relations
          const updateUser = await db.user.update({
            where: { id: user.id },
            data: { keychainId: keychainResult.id },
          });
        } catch (error) {
          console.error("Failed to create or link keychain:", error);
          // Consider handling the error appropriately, such as sending a specific response
          // to the client indicating the failure and its reason
        }
      } 
      

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
        roles: dbUser.roles,
      }
    },
    redirect() {
      return '/'
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)

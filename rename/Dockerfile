# build with dev dependencies
FROM node:lts-bullseye-slim AS build
WORKDIR /usr/src/app
COPY .swcrc ./
RUN npm install @swc/core@1.3.105 @swc/cli@0.1.64
COPY package.json ./
COPY /src ./src
RUN npm run build

# install npx to generate prisma client and remove the generator
FROM node:lts-bullseye-slim AS prisma
WORKDIR /usr/src/app
COPY prisma ./prisma
RUN sed -i '/generator json.*{/,/^}/d' ./prisma/schema.prisma
RUN npx prisma@latest generate

# start production environment with minimal dependencies
FROM node:lts-bullseye-slim AS production
RUN apt-get update || : && apt-get install -y curl
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --no-progress --omit=dev --no-audit
COPY --from=prisma /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 8080
 
CMD [ "npm", "run", "startprod" ]


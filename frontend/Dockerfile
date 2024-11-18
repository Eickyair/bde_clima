# Etapa de construcción
FROM node:18-alpine3.19 AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn prisma generate

# Etapa final
FROM node:18-alpine3.19

WORKDIR /app

COPY --from=build /app /app
RUN yarn build

CMD ["yarn","preview"]
FROM  node:18-alpine3.19

WORKDIR /app

COPY ./ ./


RUN yarn install --frozen-lockfile
RUN yarn prisma generate
CMD ["node", "index.js"]
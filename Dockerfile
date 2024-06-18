FROM node:18-alpine 
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
ENV APP_VERSION=${APP_VERSION}
ENV aws_access_key_id=${aws_access_key_id}
ENV aws_secret_access_key=${aws_secret_access_key}
ENV AWS_REGION=${AWS_REGION}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}
ENV MONGODB_CNN=${MONGODB_CNN}
ENV PORT=${PORT}
CMD ["npm", "start"]

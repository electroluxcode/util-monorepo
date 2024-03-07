FROM nginx

# 从构建阶段复制构建后的文件到Nginx镜像的HTML目录
COPY html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


# 暴露端口80供外部访问
EXPOSE 80

    

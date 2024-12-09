# Use Eclipse Temurin's Java 21 image
FROM eclipse-temurin:21-jre

# Install Tomcat
RUN apt-get update && apt-get install -y wget \
    && wget https://dlcdn.apache.org/tomcat/tomcat-10/v10.1.10/bin/apache-tomcat-10.1.10.tar.gz \
    && tar -xvf apache-tomcat-10.1.10.tar.gz -C /usr/local/ \
    && mv /usr/local/apache-tomcat-10.1.10 /usr/local/tomcat \
    && rm apache-tomcat-10.1.10.tar.gz

# Copy the WAR file to Tomcat's webapps directory
COPY target/resturantfinder.war /usr/local/tomcat/webapps/ROOT.war

# Expose port 8080
EXPOSE 8080

# Start Tomcat
CMD ["/usr/local/tomcat/bin/catalina.sh", "run"]

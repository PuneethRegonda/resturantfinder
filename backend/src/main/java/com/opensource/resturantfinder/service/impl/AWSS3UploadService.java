package com.opensource.resturantfinder.service.impl;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import com.opensource.resturantfinder.service.FileUploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service("awsS3UploadService")
public class AWSS3UploadService implements FileUploadService {
    private static final Logger logger = LoggerFactory.getLogger(AWSS3UploadService.class);

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.accessKey}")
    private String accessKey;

    @Value("${aws.secretKey}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

    private S3Client s3Client;

    // Constructor
    public AWSS3UploadService(
            @Value("${aws.s3.bucket-name}") String bucketName,
            @Value("${aws.accessKey}") String accessKey,
            @Value("${aws.secretKey}") String secretKey,
            @Value("${aws.region}") String region
    ) {
        this.bucketName = bucketName;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.region = region;

        initializeAmazonS3Client();
    }

    private void initializeAmazonS3Client() {
        try {
            logger.info("Initializing S3 Client");
            logger.info("Bucket: {}", bucketName);
            logger.info("Region: {}", region);
            logger.info("Access Key: {}", accessKey != null ? "Present" : "NULL");

            // Validate inputs
            if (accessKey == null || accessKey.trim().isEmpty()) {
                throw new IllegalArgumentException("AWS Access Key cannot be null or empty");
            }
            if (secretKey == null || secretKey.trim().isEmpty()) {
                throw new IllegalArgumentException("AWS Secret Key cannot be null or empty");
            }
            if (region == null || region.trim().isEmpty()) {
                throw new IllegalArgumentException("AWS Region cannot be null or empty");
            }

            // Create S3 Client
            this.s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)
                    ))
                    .build();

            logger.info("S3 Client initialized successfully");
        } catch (Exception e) {
            logger.error("Error initializing S3 Client", e);
            throw new RuntimeException("Failed to initialize S3 Client", e);
        }
    }

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        if (s3Client == null) {
            logger.error("S3 Client is null");
            throw new IllegalStateException("S3 Client has not been initialized");
        }

        try {
            String fileName = generateFileName(file);

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            // Upload the file to S3
            PutObjectResponse response = s3Client.putObject(putObjectRequest,
                    Paths.get(file.getOriginalFilename()));

            if (response.sdkHttpResponse().isSuccessful()) {
                String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s",
                        bucketName, region, fileName);
                logger.info("File uploaded successfully: {}", fileUrl);
                return fileUrl;
            } else {
                logger.error("Failed to upload file to AWS S3");
                throw new IOException("Failed to upload file to AWS S3");
            }
        } catch (Exception e) {
            logger.error("Error uploading file", e);
            throw new IOException("Error uploading file", e);
        }
    }

    private String generateFileName(MultipartFile file) {
        return UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
    }
}
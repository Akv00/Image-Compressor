# Image Processing System

## Overview
The system processes image data from CSV files, validates the data, compresses images asynchronously, stores the processed images in the database, and provides APIs for file submission, status checking and also to download the input and output files. It uses AWS for file storage, PostgreSQL for the database, and BullMQ and  Redis for the message queue.

## Components
1. **CSV Upload API**
2. **CSV Validation Service**
4. **Image Processing Service**
5. **Queing of the jobs with Redis Queue**
6. **Database Service**
7. **Status API**
8. **Webhook Service**
9. **AWS EC2 Instance Service**
10. **Download of Output CSV File**

## Flow
1. **CSV Upload API:**
   - Accepts CSV file.
   - Validates CSV format.
   - Stores initial data in the database.
   - Returns a unique request ID.

2. **CSV Validation Service:**
   - Ensures CSV data is correctly formatted.
   - Parses the CSV and extracts image URLs.

3. **Image Processing Service:**
   - Adds tasks to Redis queue for processing.
   - Compresses images by 50% of their original quality using Sharp.
   - Uploads processed images to AWS.
   - Updates the database with output image URLs.
   - Stores the CSV file with the output image URLs.

5. **Database Service:**
   - Stores product and image data.
   - Tracks the status of each processing request.

6. **Status API:**
   - Allows users to query the processing status using the request ID.

7. **Webhook Service:**
   - Notifies users when image processing is complete.
   - Provides processed image URLs via a callback URL.

8. **AWS**
   - Stores both input and output images.

9. **Redis Queue:**
   - Manages task queues for asynchronous processing.

## Visual Diagram
![System Design Diagram]([https://drive.google.com/file/d/1YwZVlzpcMGTiwD-bUorn1Xpbggn_DdlU/view?usp=sharing])

## Component Descriptions

1. **CSV Upload API:**
   - **Role:** Accepts CSV files from users and initiates processing.
   - **Function:** Receives CSV, validates it, stores initial data, and returns a unique request ID.

2. **CSV Validation Service:**
   - **Role:** Ensures CSV data is correctly formatted.
   - **Function:** Parses CSV and validates the data structure and extracts the image URLs.

3. **Image Processing Service:**
   - **Role:** Asynchronously processes images.
   - **Function:** Downloads, compresses, and uploads images; updates database with processed image URLs and continously tracks the percentage completion of the job.

4. **Database Service:**
   - **Role:** Manages data storage and retrieval.
   - **Function:** Stores product data, input and output image URLs, and processing status.

5. **Status API:**
   - **Role:** Provides processing status updates.
   - **Function:** Allows users to query the status of their image processing requests using a unique request ID and provide the download links of the input and output CSV files if the status is complete otherwise shows the percentage of job completed.

6. **Webhook Service:**
   - **Role:** Notifies users upon completion of image processing.
   - **Function:** Sends processed image URLs to a specified callback URL.

7. **AWS S3 Storage Service:**
   - **Role:** Stores both input and output images.
   - **Function:** Manages storage and retrieval of image files.

8. **Redis Queue:**
   - **Role:** Manages task queues for asynchronous processing.
   - **Function:** Handles queuing and distribution of image processing tasks.

## Database Schema
```sql
-- Table: Products
create type status_enum as ENUM('created','processing','completed');

drop table csv_data_table;
create table csv_data_table (
	id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	csv_path text NOT NULL,
	status status_enum NOT NULL DEFAULT 'created',
	no_of_products int NOT NULL CHECK (no_of_products > 0),
	no_of_images int NOT NULL CHECK (no_of_images > 0),
	processing_percentage int NOT NULL DEFAULT 0 CHECK (processing_percentage >= 0 and processing_percentage <= 100)
);

#include <opencv2/opencv.hpp>
#include <iostream>
#include <windows.h> 
#include <Mmsystem.h>
#include "stdio.h"
#include <time.h>
#include "cv.h"  
#include "cxcore.h"  
#include "highgui.h"

using namespace cv;
using namespace std;

// Notes for Shawn

// Every moment frame is updated - send the frame to server API via POST call. Assume server connection is localhost:4200

// use POST request for both frame and video recording

// video frame request : localhost:4200/:cameraid - send a frame

// video recording request: localhost:4200/motion/:cameraid - send a video file + Time of clip and End of clip.


//this function is a test functino of your camera
void readCamera() {
	VideoCapture capture(0);
	if (!capture.isOpened())
		return;
	Mat edges;
	while (1) {
		Mat frame;
		capture >> frame;
		if (frame.empty()) {
			break;
		}
		else {
			cvtColor(frame, edges, CV_BGR2GRAY);
			blur(edges, edges, Size(7, 7));
			Canny(edges, edges, 0, 30, 3);
			imshow("Video", frame);
		}
		waitKey(1);
	}
	capture.release();
	destroyAllWindows();
}

//this function is to write a video depends on the length of the video, the capture it gets matrices from and the count number of the that video
void writeVideo(int timer, VideoCapture capture,int count) {
	
	//form the name for the video
	string video_name = "motion";
	video_name += to_string(count);
	video_name += ".avi";

	//VideoWriter (const String &filename, int fourcc, double fps, Size frameSize, bool isColor=true)
	VideoWriter writer(video_name, CV_FOURCC('M', 'J', 'P', 'G'),15.0f, Size(640, 480));
	
	int64 t0 = getTickCount(); // start time
	while (capture.isOpened()) {
		Mat frame;
		capture >> frame;
		imshow("Camera", frame);
		//read the current frame
		writer << frame;
		//save the read frame
		int64 t1 = getTickCount();
		double timeRunning = double(t1 - t0)/getTickFrequency();
		if (timeRunning>=timer){
			break;
		}
	}
}


//the diffImage and motion is a backgrouop subtraction algorithm, will not be called currently
/*
Mat diffImage(Mat t0, Mat t1, Mat t2)
{
	Mat d1, d2, motion;
	absdiff(t2, t1, d1);
	absdiff(t1, t0, d2);
	bitwise_and(d1, d2, motion);
	return motion;
}

int motion() {
	VideoCapture capture(0);
	Mat frame, prev_frame, next_frame, pbwf, bwf, nbwf;
	//capture.open( 0 );
	if (!capture.isOpened()) { printf("--(!)Error opening video capture\n"); return -1; }

	capture.read(prev_frame);
	capture.read(frame);
	capture.read(next_frame);
	cvtColor(prev_frame, pbwf, cv::COLOR_BGR2GRAY);
	cvtColor(frame, bwf, CV_RGB2GRAY);
	cvtColor(next_frame, nbwf, cv::COLOR_BGR2GRAY);
	while (1)
	{
		imshow("diff", diffImage(pbwf, bwf, nbwf));
		imshow("pnwf", pbwf);
		imshow("bnwf", bwf);
		imshow("nbwf", nbwf);
		//prev_frame=frame;
	   //frame=next_frame;
		pbwf = bwf;
		bwf = nbwf;
		capture.read(next_frame);
		cvtColor(next_frame, nbwf, cv::COLOR_BGR2GRAY);
		char c = waitKey(5);
		if ((char)c == 27)
			break;
	}
	return 0;
}
*/
int motion2() {
	bool writingVideo = false;  //a boolean to determine whether we are writing a video
	int video_count = 0;   //the counter of the video
	Mat frame, gray, frameDelta, thresh, firstFrame;
	vector<vector<Point> > cnts;
	VideoCapture camera(0); //open camera
	//set the video size to 640x480
	camera.set(3, 640);
	camera.set(4, 480);
	/*
	for (int i = 0; i < 10; i++) {
		cout<<camera.get(5)<<endl;
	}
	*/
	Sleep(3);
	camera.read(frame);
	//convert to grayscale and set the first frame
	cvtColor(frame, firstFrame, COLOR_BGR2GRAY);
	GaussianBlur(firstFrame, firstFrame, Size(21, 21), 0);

	while (camera.read(frame)) {
		if (writingVideo == false) {
			//convert to grayscale
			cvtColor(frame, gray, COLOR_BGR2GRAY);
			GaussianBlur(gray, gray, Size(21, 21), 0);
			//compute difference between first frame and current frame
			absdiff(firstFrame, gray, frameDelta);
			threshold(frameDelta, thresh, 25, 255, THRESH_BINARY);
			dilate(thresh, thresh, Mat(), Point(-1, -1), 2);
			findContours(thresh, cnts, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE);
			for (int i = 0; i < cnts.size(); i++) {
				if (contourArea(cnts[i]) < 500) {
					continue;
				}
				writingVideo = true;
				putText(frame, "Motion Detected", Point(10, 20), FONT_HERSHEY_SIMPLEX, 0.75, Scalar(0, 0, 255), 2);
			}
			imshow("Camera", frame);
			camera.read(frame);
			//convert to grayscale and set the first frame
			cvtColor(frame, firstFrame, COLOR_BGR2GRAY);
			GaussianBlur(firstFrame, firstFrame, Size(21, 21), 0);
			if (waitKey(1) == 27) {
				//exit if ESC is pressed
				break;
			}
		}
		else {
			//set the length of record,camear and the count of the  video and write a video
			writeVideo(6,camera,video_count);

			video_count += 1;    //increase the count of the video

			writingVideo = false;

			//reset the first frame to current frame
			camera.read(frame);
			//convert to grayscale and set the first frame
			cvtColor(frame, firstFrame, COLOR_BGR2GRAY);
			GaussianBlur(firstFrame, firstFrame, Size(21, 21), 0);
		}
	}
	return 0;
}

int main(int argc, char** argv) {

	motion2();
	return 0;
}


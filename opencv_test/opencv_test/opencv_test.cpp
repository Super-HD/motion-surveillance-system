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

void writeVideo(int timer) {
	VideoCapture capture(0);

	//VideoWriter (const String &filename, int fourcc, double fps, Size frameSize, bool isColor=true)
	VideoWriter writer("test.avi", CV_FOURCC('M', 'J', 'P', 'G'),24.0f, Size(640, 480));
	int64 t0 = getTickCount(); // start time
	while (capture.isOpened()) {
		Mat frame;
		capture >> frame;
		//read the current frame
		writer << frame;
		//save the read frame
		imshow("video", frame);
		//press Esc to Exit
		int64 t1 = getTickCount();
		double timeRunning = double(t1 - t0)/getTickFrequency();
		if (timeRunning>=timer){
			break;
		}
	}
}

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

int motion2() {
	Mat frame, gray, frameDelta, thresh, firstFrame;
	vector<vector<Point> > cnts;
	VideoCapture camera(0); //open camera
	//set the video size to 512x288 to process faster
	camera.set(3, 512);
	camera.set(4, 288);
	Sleep(3);
	camera.read(frame);
	//convert to grayscale and set the first frame
	cvtColor(frame, firstFrame, COLOR_BGR2GRAY);
	GaussianBlur(firstFrame, firstFrame, Size(21, 21), 0);

	while (camera.read(frame)) {
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
			putText(frame, "Motion Detected", Point(10, 20), FONT_HERSHEY_SIMPLEX, 0.75, Scalar(0, 0, 255), 2); 
			writeVideo(5);
		}
		imshow("Camera", frame);
		if (waitKey(1) == 27) {
			//exit if ESC is pressed
			break;
		}
	}

	return 0;
}

void times()
{
  SYSTEMTIME sys_time;
  GetLocalTime( &sys_time );
  printf( "%4d/%02d/%02d %02d:%02d:%02d.%03d 星期%1d\n",sys_time.wYear,
	sys_time.wMonth,
	sys_time.wDay,
	sys_time.wHour,
	sys_time.wMinute,
	sys_time.wSecond,
	sys_time.wMilliseconds,
	sys_time.wDayOfWeek);
 system("time");
 system("pause");
} 

/*
int film1Sc(int timea) {
	CvCapture* capture = cvCaptureFromCAM(0);
	CvVideoWriter* video = NULL;
	IplImage* frame = NULL;
	int n;
	if (!capture)
	{
		cout << "Can not open the camera." << endl;
		return -1;
	}
	else
	{
		frame = cvQueryFrame(capture); 
		int c = 0;
		SYSTEMTIME sys_time;

		GetLocalTime(&sys_time);
		char buf[1024];
		sprintf_s(buf, "camera-%4d-%2d-%02d-%02d-%02d-%02d.avi", sys_time.wYear, sys_time.wMonth, sys_time.wDay,
			sys_time.wHour, sys_time.wMinute, sys_time.wSecond);

		video = cvCreateVideoWriter(buf, CV_FOURCC('X', 'V', 'I', 'D'), 25,
			cvSize(frame->width, frame->height)); 
 
		if (video) 
		{
			cout << "VideoWriter has created." << endl;
		}
		cout << "set the record time\n" << endl;
		cin >> timea;
		int ti = timea * 25;


		cvNamedWindow("Camera Video", 1);  
		int i = 0;
		while (i <= ti) 
		{
			frame = cvQueryFrame(capture); 
			if (!frame)
			{
				cout << "Can not get frame from the capture." << endl;
				break;
			}
			n = cvWriteFrame(video, frame);  
			// cout<<n<<endl;  
			cvShowImage("Camera Video", frame);
			i++;
			if (cvWaitKey(2) > 0)
				break;
		}

		cvReleaseVideoWriter(&video); 
		cvReleaseCapture(&capture);
		cvDestroyWindow("Camera Video");
	}
	return 0;

}
*/
int main(int argc, char** argv) {

	motion2();
	return 0;
}



#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;

// Notes for Shawn

// Every moment frame is updated - send the frame to server API via POST call. Assume server connection is localhost:4200
// use POST request for both frame and video recording

// video frame request : localhost:4200/:cameraid - send a frame
// video recording request: localhost:4200/motion/:cameraid - send a video file + Time of clip and End of clip.


void readCamera()
{
	VideoCapture capture(0);
	if (!capture.isOpened())
		return;
	Mat edges;
	while (1)
	{
		Mat frame;
		capture >> frame;
		if (frame.empty())
		{
			break;
		}
		else
		{
			cvtColor(frame, edges, CV_BGR2GRAY);
			blur(edges, edges, Size(7, 7));
			Canny(edges, edges, 0, 30, 3);
			imshow("Video", frame);
		}
		waitKey(30);
	}
	capture.release();
	destroyAllWindows();
}

int main(int argc, char **argv)
{
	VideoCapture cam(0);
	if (!cam.isOpened())
	{
		cout << "cam open failed!" << endl;
		return -1;
	}
	cout << "cam open success!" << endl;
	namedWindow("cam");
	Mat img;
	VideoWriter vw;
	int fps = cam.get(CAP_PROP_FPS); //set camera fps
	if (fps <= 0)
		fps = 25;
	//create file  for recording
	vw.open("out.avi",															 //path
					VideoWriter::fourcc('X', '2', '6', '4'), //form
					fps,																		 //fps
					Size(cam.get(CAP_PROP_FRAME_WIDTH),
							 cam.get(CAP_PROP_FRAME_HEIGHT)) //size
	);
	if (!vw.isOpened())
	{
		cout << "VideoWriter open failed!" << endl;
		return -1;
	}
	cout << "VideoWriter open success!" << endl;
	for (;;)
	{
		cam.read(img);
		if (img.empty())
			break;
		imshow("cam", img);
		//write in video file
		vw.write(img);
		if (waitKey(5) == 'q')
			break;
	}
	waitKey(0);
	return 0;
}

/*
int main() {
	readCamera();
	Mat img = imread("C:\\Users\\52000\\Desktop\\biaoqingbao\\1.jpg");
	imshow("1", img);
	waitKey(0);
	destroyAllWindows();
	return 0;
}
*/

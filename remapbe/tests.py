from urllib import response
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import io
import pandas as pd
from django.core.files.uploadedfile import SimpleUploadedFile


def generate_excel(df):
    tempfile = io.BytesIO()
    df.to_excel(tempfile, index=False)
    tempfile.seek(0)
    excel_file = SimpleUploadedFile(
        "realestate.xlsx",
        content=tempfile.read(),
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    return excel_file


# Create your tests here.
class FileUploadTests(APITestCase):

    # Test upload and parsing of the excel file in normal operation
    def test_upload_file(self):

        # Create in-memory file upload
        columns = ["Id", "Address"]
        val = [[1, "123 Street A"], [2, "456 StreetB"]]
        df = pd.DataFrame(val, columns=columns)

        excel_upload_file = generate_excel(df)

        response = self.client.post(
            reverse("remapbe:uploadfile"), {"file": excel_upload_file}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["columns"], columns)
        self.assertEqual(response.data["data"], val)

    def test_no_file_upload(self):
        response = self.client.post(reverse("remapbe:uploadfile"))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_wrong_type_file_upload(self):
        video = SimpleUploadedFile(
            "file.mp4", b"file_content", content_type="video/mp4"
        )
        response = self.client.post(reverse("remapbe:uploadfile"), {"file": video})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SearchTests(APITestCase):
    def test_search(self):
        columns = ["Thông Số", "Giá"]
        val = [["369 ngõ Quỳnh, Hà Nội", "5"], ["121 Kim Ngưu Hà Nội", "5"]]
        df = pd.DataFrame(val, columns=columns)
        excel_upload_file = generate_excel(df)

        response = self.client.post(
            reverse("remapbe:search"),
            {
                "file": excel_upload_file,
                "center": "254 Minh Khai Hà Nội",
                "addressColumn": "Thông Số",
                "distance": 5,
                "unit": "km",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

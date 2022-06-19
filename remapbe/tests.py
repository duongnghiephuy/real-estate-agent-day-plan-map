from urllib import response
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
import io
import pandas as pd
from django.core.files.uploadedfile import SimpleUploadedFile

# Create your tests here.
class FileUploadTests(APITestCase):

    # Test upload and parsing of the excel file in normal operation
    def test_upload_file(self):

        # Create in-memory file upload
        columns = ["Id", "Address"]
        val = [[1, "123 Street A"], [2, "456 StreetB"]]
        df = pd.DataFrame(val, columns=columns)
        tempfile = io.BytesIO()
        df.to_excel(tempfile, index=False)
        tempfile.seek(0)

        excel_upload_file = SimpleUploadedFile(
            "realestate.xlsx",
            content=tempfile.read(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

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

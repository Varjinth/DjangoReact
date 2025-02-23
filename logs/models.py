from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return self.username


class Trip(models.Model):
    TRAVEL_MODES = [
        ('Flight', 'By Flight'),
        ('Train', 'By Train'),
        ('Bus', 'By Bus'),
        ('Car', 'By Car'),
    ]

    BOOKING_MODES = [
        ('Self', 'Self'),
        ('Travel Desk', 'Travel Desk'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")
    project_name = models.CharField(max_length=255)
    purpose_of_travel = models.TextField()
    travel_start_date = models.DateField()
    travel_mode = models.CharField(max_length=10, choices=TRAVEL_MODES)
    ticket_booking_mode = models.CharField(max_length=20, choices=BOOKING_MODES)
    travel_start_location = models.CharField(max_length=255)
    travel_end_location = models.CharField(max_length=255)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.project_name} - {self.travel_start_location} to {self.travel_end_location}"

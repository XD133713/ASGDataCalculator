from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    @property
    def is_staff(self):
        return self.is_admin
    @property
    def is_superuser(self):
        return self.is_admin  

class SavedCalculator(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    data = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)

class UserCounter(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    login_amount = models.IntegerField(default=0)
    @property
    def calculator_amount(self):
        return self.user.savedcalculator_set.count()
  

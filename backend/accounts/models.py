from django.db import models
from django.contrib.auth.models import User

class SavedCalculator(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    data = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)

class UserCounter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    login_amount = models.IntegerField(default=0)
    @property
    def calculator_amount(self):
        return self.user.savedcalculator_set.count()


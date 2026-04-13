from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, UserSavedCalculatorsViewSet, NameView, AdminUsersViewSet, AdminSavedCalculatorsViewSet, AdminReportView, UserReportView
from rest_framework_simplejwt.views import (TokenRefreshView)

router = DefaultRouter()
router.register('userSavedCalculators', UserSavedCalculatorsViewSet, basename='userSavedCalculators')
router.register('adminUsers', AdminUsersViewSet, basename='adminUsers')
router.register('adminSavedCalculators', AdminSavedCalculatorsViewSet, basename='adminSavedCalculators')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', LoginView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('name/', NameView.as_view(), name='name'),
    path('report/', UserReportView.as_view(), name='report'),
    path('adminReport/', AdminReportView.as_view(), name='adminReport'),
    path('', include(router.urls)),
]

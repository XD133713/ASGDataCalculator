from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, SavedCalculatorViewSet, NameView, UsersViewSet, SavedCalculatorsViewSet, AdminReportView, UserReportView
from rest_framework_simplejwt.views import (TokenRefreshView)

router = DefaultRouter()
router.register('calculators', SavedCalculatorViewSet, basename='calculator')
router.register('users', UsersViewSet, basename='users')
router.register('savedCalculators', SavedCalculatorsViewSet, basename='savedCalculators')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', LoginView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('name/', NameView.as_view(), name='name'),
    path('adminReport/', AdminReportView.as_view(), name='adminReport'),
    path('report/', UserReportView.as_view(), name='report'),
    path('', include(router.urls)),
]








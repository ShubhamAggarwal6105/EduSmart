from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import LearningJourney

class Command(BaseCommand):
    help = 'Assigns existing learning journeys to a specific user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username to assign journeys to')

    def handle(self, *args, **options):
        username = options['username']
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User {username} does not exist'))
            return
        
        # Get all journeys that don't have a user assigned
        journeys = LearningJourney.objects.filter(user__isnull=True)
        
        if not journeys.exists():
            self.stdout.write(self.style.WARNING('No unassigned journeys found'))
            return
        
        # Assign the user to each journey
        count = 0
        for journey in journeys:
            journey.user = user
            journey.save()
            count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully assigned {count} journeys to user {username}'))

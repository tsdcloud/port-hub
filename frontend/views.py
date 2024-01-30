from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from . models import Profil
from . forms import LoginForm, ApiForm
from . serviceuser import (
    connect
)
from . import servicefunction as sfunction
from . import servicecategorie as scategorie
from . import servicearticle as sarticle
from . import servicestockageaera as sstockageaera
from . import servicecareer as scareer
from . import servicestockageaeralv as sstockageaeralv
from . import servicecareerlv as scareerlv
from . import servicecareerarticle as scareerarticle

from . constances import (
    ENDPOINT_ENTITY,
    ENDPOINT_CAREER,
    ENDPOINT_USER,
    ENDPOINT_PORT
)

import http.client
import json
import requests


# Create your views here.
def index(request, *args, **kwargs):
    if request.user.is_authenticated:
        return redirect(reverse('frontend_dashboard'))
    return render(request, 'frontend/login.html')


def f_login(request):
    if request.method == 'GET':
        return redirect(reverse('frontend_index'))
    else:
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            res = connect(email=email, password=password)
            if res.get('detail', 0) != 0:
                messages.error(request, res['detail'])
                return render(
                    request,
                    'frontend/login.html',
                    {'form': form}
                )
            else:
                request.infoUser = res
                try:
                    user = User.objects.get(username=email)
                except User.DoesNotExist:
                    user = User.objects.create_user(
                        username=email,
                        password=password
                    )

                if not hasattr(user, 'profil') :
                    profil = Profil()
                    profil.access = "e"
                    profil.refresh = "e"
                    profil.user = user
                    profil.save()

                user.profil.access = res["access"]
                user.profil.refresh = res['refresh']
                user.profil.save()

                if user.is_active:
                    user = authenticate(
                        request,
                        username=email,
                        password=password
                    )
                    login(request, user)
                    return redirect(reverse('frontend_dashboard'))
                else:
                    messages.warning(request, 'Compte suspendu')
                    return render(
                        request,
                        'frontend/login.html',
                        {'form': form}
                    )
        else:
            messages.error(
                request,
                "Veuillez compléter le formulaire ci-dessus"
            )
            return render(
                request,
                'frontend/login.html',
                {'form': form}
            )


@login_required(login_url='/')
def d_logout(request):
    logout(request=request)
    return render(request, 'frontend/login.html')

@login_required(login_url='/')
def dashbord(request):
    #logout(request=request)
    return render(request, 'frontend/index.html')


@login_required(login_url='/')
def user(request):
    conn = http.client.HTTPSConnection(ENDPOINT_USER)
    payload = ''
    headers = {
        "Authorization": 'Bearer ' + request.user.profil.access
    }
    conn.request("GET", "/users/account/", payload, headers)
    response = conn.getresponse()
    data = json.loads(response.read())
    data['access'] = request.user.profil.access
    if response.status == 401:
        logout(request=request)
        return JsonResponse({"status":401},401)
    return JsonResponse(data, status=response.status)


@login_required(login_url='/')
def function(request):
    data = {"status": 400}
    if request.method == "GET":
        data = sfunction.read(request=request)
    elif request.method == "POST":
        data = sfunction.create(request=request)
    return JsonResponse(data, status=data['status'])


@login_required(login_url='/')
def categorie(request):
    data = {"status": 400}
    if request.method == "GET":
        data = scategorie.read(request=request)
    elif request.method == "POST":
        data = scategorie.create(request=request)
    return JsonResponse(data, status=data['status'])


@login_required(login_url='/')
def article(request):
    data = {"status": 400}
    if request.method == "GET":
        data = sarticle.read(request=request)
    elif request.method == "POST":
        data = sarticle.create(request=request)
    return JsonResponse(data, status=data['status'])


@login_required(login_url='/')
def stockageaera(request):
    data = {"status": 400}
    if request.method == "GET":
        data = sstockageaera.read(request=request)
    elif request.method == "POST":
        data = sstockageaera.create(request=request)
    return JsonResponse(data, status=data['status'])


@login_required(login_url='/')
def career(request):
    data = {"status": 400}
    if request.method == "GET":
        data = scareer.read(request=request)
    elif request.method == "POST":
        data = scareer.create(request=request)
    return JsonResponse(data, status=data['status'])


@login_required(login_url='/')
def stockageaeralv(request):
    data = {"status": 400}
    if request.method == "GET":
        data = sstockageaeralv.read(request=request)
    elif request.method == "POST":
        data = sstockageaeralv.create(request=request)
    return JsonResponse(data, status=data['status'])


@login_required(login_url='/')
def careerlv(request):
    data = {"status": 400}
    if request.method == "GET":
        data = scareerlv.read(request=request)
    elif request.method == "POST":
        data = scareerlv.create(request=request)
    return JsonResponse(data, status=data['status'])


@login_required(login_url='/')
def careerarticle(request):
    data = {"status": 400}
    if request.method == "GET":
        data = scareerarticle.read(request=request)
    elif request.method == "POST":
        data = scareerarticle.create(request=request)
    return JsonResponse(data, status=data['status'])


@login_required(login_url='/')
@csrf_exempt
def api(request):
    data = {"status": 402}

    if request.method == "GET":
        form = ApiForm(request.GET)
        payload = '?page=2'
        verb = 'GET'
    else:
        charge = json.loads(request.body)
        form = ApiForm(charge)
        payload = json.dumps(charge)
        if charge.get('data', 0) != 0:    #hasattr(charge, 'data'):
            payload=json.dumps(charge['data'])
        verb = request.method

    if form.is_valid():
        end = form.cleaned_data['end']
        detail = form.cleaned_data['detail']
        terminaison = form.cleaned_data['terminaison']
        id = form.cleaned_data.get('id', 'abc')
        action = form.cleaned_data.get('action', '')
        page = form.cleaned_data.get('page', 1)

        if end == 'career':
            ENDPOINT = ENDPOINT_CAREER
        elif end == 'entity':
            ENDPOINT = ENDPOINT_ENTITY
        elif end == 'port':
            ENDPOINT = ENDPOINT_PORT
        else:
            ENDPOINT = ENDPOINT_USER

        headers = {
            "Authorization": 'Bearer ' + request.user.profil.access,
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }  

        if detail is True:
            url = "/" + str(terminaison) + "/" + str(id) + "/" + str(action)
        else:
            url = "/" + str(terminaison)+ "/" + str(action)
        
        if page not in [1, '1', '']:
            url += '?page=' + str(page)
        
        try:
            conn = http.client.HTTPSConnection(ENDPOINT)
            conn.request(verb, url, payload, headers)
            response = conn.getresponse()
            status = response.status
            data = json.loads(response.read())
        except:
            url = 'http://' + ENDPOINT + url
            if request.method == "GET":
                response = requests.get(url=url, headers=headers)
            elif request.method == "POST":
                response = requests.post(url=url, headers=headers, data=payload)
            else:
                response = requests.post(url=url, headers=headers, data=payload)
             
            status = response.status_code
            data = response.json()

        try:
            data['status'] = status
            data['url'] = url
        except:
            data = {
                "results" : data,
                "status" : status,
                "url" : url
            }
        
    else:
        data['errors'] = {
           "end": form['end'].errors,
           "detail": form['detail'].errors,
           "terminaison": form['terminaison'].errors,
           "id": form['id'].errors,
           "action": form['action'].errors,
           "verb": verb
        }
    return JsonResponse(data, status=status)

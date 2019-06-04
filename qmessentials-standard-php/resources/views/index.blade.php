@extends('layouts/app')

@section('title','Home')

@section('content')
    <div class="container">
        <ul class="list-group">
            <li class="list-group-item"><a href="/metrics">Metrics</a></li>
            <li class="list-group-item"><a href="/test-plans">Test Plans</a></li>
            <li class="list-group-item"><a href="/products">Products</a></li>
            <li class="list-group-item"><a href="/lots">Lots</a></li>
            <li class="list-group-item"><a href="/test-runs">Test Runs</a></li>
            <li class="list-group-item"><a href="/users">Users</a></li>
            <li class="list-group-item"><a href="/reports/results-by-lot">Results by Lot</a></li>
        </ul>
    </div>
@endsection
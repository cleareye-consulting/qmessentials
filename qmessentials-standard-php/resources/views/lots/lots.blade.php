@extends('layouts/app')

@section('title','Lots')

@section('content')
    <div class="container">
        <h2 class="subtitle">Lots</h2>  
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Created</th>
                </tr>
            </thead>
            <tbody>
            @foreach($lots as $lot) 
                <tr>
                    <td><a href="/lots/{{$lot->lot_id}}/edit">{{$lot->lot_number}}</a></td>
                    <td>{{$lot->product_name}}</td>
                    <td>{{$lot->customer_name}}</td>
                    <td>{{$lot->created_date}}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div>
            <a href="/lots/create">Add a Lot</a>
        </div>
    </div>
@endsection